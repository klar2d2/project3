import axios, { AxiosError, AxiosResponse } from "axios";
import dotenv from "dotenv";
import express, { Request, Response, Router } from "express";
import { sha256 } from "js-sha256";
import { IUserModel, User } from "../../models";

const router: Router = express.Router();
dotenv.config();

const BASE_URL = "https://graph.facebook.com/v4.0/";
const accessToken = "EAAHEmPLN9ZAYBAOcRwkjt9gZCELQBqVimYmqhasrBbE4Tm4WFeVIZAZABdU1aZABJdmNyuJ9iyGrMopdDeCZCNlaUjbUUqXYV7bVUi4szAAmlqzbZAMlokBNu9OtW8nwqm9yHnsE3D2baGf6MfGPR2joemGjMLp2ZAUBqWTdpX7Bbmq1zovZBTufM";

const errorCatch = (err: AxiosError, message: string) => {
  console.log(message, err);
};

const getAppSecretProof = (token: string, appSecret: string): string => {
  return sha256.hmac(appSecret, token);
};

const makeApiCall = async (url: string, errorMessage: string, callback: any) => {
  return  await axios.get(url)
  .then((response) => {
    return callback(response);
  })
  .catch((err) => {
    console.log(errorMessage, err);
  });
};

const getAllInstagramPosts = async (req: Request, res: Response) => {
  let postIdList: any[] = [];
  let postPromises: any[] = [];
  const user = await User.findById(req.params.userId)
    .then((userDoc) => {
      return userDoc;
    })
    .catch((err: AxiosError) => {
      errorCatch(err, "Error getting User");
    });
  if (user) {
    if (process.env.APP_SECRET) {
      user.vendor.appSecretProof = getAppSecretProof(accessToken, process.env.APP_SECRET);
    }
    const mediaListURL = BASE_URL + user.vendor.instagramIdPage + "/media?access_token=" + accessToken;
    postIdList = await makeApiCall(mediaListURL, "Error with getting media list", (response: any) => {
      return response.data.data;
    });
    postPromises = postIdList.map(async (post) => {
      // tslint:disable-next-line: max-line-length
      const mediaDataURL = BASE_URL + post.id + "?fields=id,media_type,media_url,timestamp&access_token=" + accessToken + "&appsecret_proof=" + user.vendor.appSecretProof;
      return makeApiCall(mediaDataURL, "Error getting Media data", (response: any) => response.data);
    });
  }
  const postsArray: any[] = [];
  axios.all(postPromises)
  .then(axios.spread((...posts) => {
    for (const post of posts) {
      postsArray.push(post);
    }
  }))
  .then(() => {
      res.send({ message: postsArray });
  })
  .catch((err: AxiosError) => {
      errorCatch(err, "Error resolving media metadata promises");
  });
};

const getOneInstagramPost = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId)
    .then((userDoc) => {
      return userDoc;
    })
    .catch((err: AxiosError) => {
      errorCatch(err, "Error getting User");
    });
  let appSecretProof: string = "";
  if (user) {
    if (process.env.APP_SECRET) {
      appSecretProof = getAppSecretProof(accessToken, process.env.APP_SECRET);
    }
  }
  axios.get(BASE_URL + req.params.id + "?fields=id,media_type,media_url,timestamp&access_token=" + accessToken + "&appsecret_proof=" + appSecretProof)
  .then((response: AxiosResponse) => {
    return response.data;
  })
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    errorCatch(err, "Error gettting media metadata");
  });
};

const getFrontpageInstagramPosts = async (req: Request, res: Response) => {
  const users: IUserModel[] = await User.find({ vendor: { $exists: true }});
  const postIdList = await Promise.all(users.map(async (user) => {
    if (user) {
      if (accessToken) {
        user.vendor.instagramAccessToken = accessToken;
      }
      if (process.env.APP_SECRET) {
        user.vendor.appSecretProof = getAppSecretProof(user.vendor.instagramAccessToken, process.env.APP_SECRET);
      }
      // tslint:disable-next-line: max-line-length
      const mediaIdUrl = BASE_URL + user.vendor.instagramIdPage + "/media?access_token=" + user.vendor.instagramAccessToken;
      const postId = await makeApiCall(mediaIdUrl, "Error getting Media id", (response) => {
        return response.data.data[0].id;
      });
      return {
        accessToken: user.vendor.instagramAccessToken,
        appSecretProof: user.vendor.appSecretProof,
        postId,
      };
    }
  }));
  const postPromises = postIdList.map( async (post) => {
    if (post) {
      const mediaDataURL = BASE_URL + post.postId + "?fields=id,media_type,media_url,timestamp&access_token=" +
                          post.accessToken + "&appsecret_proof=" + post.appSecretProof;
      return makeApiCall(mediaDataURL, "Error getting Media data", (response) => response.data );
    }
  });
  const postsArray: any[] = [];
  axios.all(postPromises)
  .then(axios.spread((...posts) => {
    for (const post of posts) {
      postsArray.push(post);
    }
  }))
  .then(() => {
    res.send({message: postsArray });
  })
  .catch((err) => {
    errorCatch(err, "Error resolving media metadata promises");
  });
};

router.get("/user/:userId", getAllInstagramPosts);
router.get("/user/:userId/:id", getOneInstagramPost);
router.get("/frontpage", getFrontpageInstagramPosts);


export default router;
