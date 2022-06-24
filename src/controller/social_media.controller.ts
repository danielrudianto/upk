import { Request, Response } from "express";
import PostModel from "../models/post.model";
import firebase from "../helper/firebase.helper";
import { v4 } from "uuid";
import PostMediaModel from "../models/post_media.model";
import CommentModel from "../models/comment.model";
import PostReactionModel from "../models/post_reaction.model";
import { validationResult } from "express-validator";
import MediaHelper from "../helper/media.helper";
import QueryTransactionHelper from "../helper/transaction.helper";

class socialMediaController {
  static createPost = (req: Request, res: Response) => {
    const post = new PostModel(req.body.caption, req.body.userId, req.body.districtId);
    post
      .create()
      .then((result) => {
        const files: any[] = [];

        (req.body.media as any[]).forEach((file) => {
          const base64string = file.file;
          const name = file.name;
          const names = name.split(".");
          const extension = names[names.length - 1];
          const uid = v4();
          const fileName = `${uid}.${extension}`;
          try {
            files.push({
              file: MediaHelper.toFile(base64string),
              fileName: fileName,
              name: name,
            });
          } catch (error) {
            return res.status(500).send(error);
          }
        });

        if (files.length > 0) {
          const bucket = firebase
            .storage()
            .bucket("gs://abangku-apps.appspot.com");
          files.forEach((x, index) => {
            bucket
              .file(x.fileName)
              .save(x.file)
              .then(() => {
                const post_media = new PostMediaModel(
                  files[index].name,
                  files[index].fileName,
                  result.id
                );

                post_media.create().then(() => {
                  if (index == files.length - 1) {
                    PostModel.fetchPostByUID(result.uid)
                      .then((post) => {
                        return res.status(201).send(post);
                      })
                      .catch((error) => {
                        return res.status(500).send(error);
                      });
                  }
                });
              })
              .catch((error) => {
                return res.status(500).send(error);
              });
          });
        }
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  };

  static deletePost = (req: Request, res: Response) => {
    const post_uid = req.params.postId;
    PostModel.fetchPostByUID(post_uid).then((post) => {
      if (post == null || post.is_delete) {
        return res.status(404).send("Post tidak ditemukan.");
      } else {
        PostModel.delete(post.id)
          .then(() => {
            return res.status(200).send("Post berhasil dihapus.");
          })
          .catch((error) => {
            console.error(`[error]: Delete post ${new Date()}`);
            console.error(`[error]: ${error}`);

            return res.status(500).send(error);
          });
      }
    });
  };

  static createComment = (req: Request, res: Response) => {
    const val_result = validationResult(req);
    if (!val_result.isEmpty()) {
      return res.status(500).send(val_result.array()[0].msg);
    }

    //    Get the following data to proceed comment
    //    1. Post UID
    //    2. Comment

    const post_uid = req.body.post_uid;
    const comment = req.body.comment;

    PostModel.fetchPostByUID(post_uid)
      .then((result) => {
        if (result == null) {
          return res
            .status(404)
            .send("Post tidak ditemukan atau sudah dihapus.");
        } else {
          const commentModel = new CommentModel(
            comment,
            result.id,
            req.body.userId
          );
          commentModel
            .createComment()
            .then((result) => {
              return res.status(201).send(result);
            })
            .catch((error) => {
              console.error(`[error]: Creating comment ${new Date()}`);
              console.error(`[error]: ${error}`);

              return res.status(500).send(error);
            });
        }
      })
      .catch((error) => {
        console.error(`[error]:Fetching post ${new Date()}`);
        console.error(`[error]: ${error}`);

        return res.status(500).send(error);
      });
  };

  static react = (req: Request, res: Response) => {
    const val_result = validationResult(req);
    if (!val_result.isEmpty()) {
      return res.status(500).send(val_result.array()[0].msg);
    }

    const post_uid = req.body.post_uid;
    PostModel.fetchPostByUID(post_uid).then((post) => {
      if (post == null || post.is_delete) {
        return res.status(404).send("Post tidak ditemukan.");
      } else {
        PostReactionModel.checkReaction(post.id, req.body.userId).then(
          (reaction) => {
            if (reaction == 0) {
              // User has not react to this post
              const post_reaction = new PostReactionModel(
                post.id,
                req.body.userId
              );
              post_reaction
                .create()
                .then(() => {
                  return res.status(201).send("Reaksi berhasil dibuat.");
                })
                .catch((error) => {
                  console.error(
                    `[error]: Failed createing reaction ${new Date()}`
                  );
                  console.error(`[error]: ${error}`);

                  return res.status(500).send(error);
                });
            } else {
              // User has react to this post
              const post_reaction = new PostReactionModel(
                post.id,
                req.body.userId
              );
              post_reaction
                .delete()
                .then(() => {
                  return res.status(201).send("Reaksi berhasil dihapus.");
                })
                .catch((error) => {
                  console.error(
                    `[error]: Failed deleting reaction ${new Date()}`
                  );
                  console.error(`[error]: ${error}`);

                  return res.status(500).send(error);
                });
            }
          }
        );
      }
    });
  };

  static fetchByUID = (req: Request, res: Response) => {
    const uid = req.params.postId;
    const fetch_posts = PostModel.fetchPostByUID(uid);
    const fetch_comments = CommentModel.fetchByPostUID(uid);

    QueryTransactionHelper.create([
        fetch_posts,
        fetch_comments
    ]).then(result => {
        if(result[0] == null || result[0].is_delete){
            return res.status(404).send("Post tidak ditemukan.");
        }

        return res.status(200).send({
            ...result[0],
            post_comment: result[1]
        })
    }).catch(error => {
        console.error(`[error]: Fetching post by UID ${new Date()}`);
        console.error(`[error]: ${error}`);
        
        return res.status(500).send(error);
    })
  }

  static fetch = (req: Request, res: Response) => {
    const last_fetched = !req.query.last_fetched_post
      ? null
      : req.query.last_fetched_post.toString();
    let post: any | null = null;
    if (last_fetched != null) {
      PostModel.fetchPostByUID(last_fetched).then((last_post) => {
        post = last_post;
      });
    }

    PostModel.fetch(post == null ? null : post.id)
      .then((posts) => {
        posts.forEach((post, index) => {
          posts[index].post_media.forEach((media, i) => {
            posts[index].post_media[
              i
            ].url = `${process.env.STORAGE_URL}${media.url}`;
          });

          const post_reaction: any = {
            count: post.reaction.length,
            has_reacted:
              post.reaction.filter((x) => x.created_by == req.body.userId)
                .length == 0
                ? false
                : true,
          };

          posts[index].reaction = post_reaction;
        });

        return res.status(200).send(posts);
      })
      .catch((error) => {
        console.error(`[error]: Fetching posts ${new Date()}`);
        console.error(`[error]: ${error}`);

        return res.status(500).send(error);
      });
  };

  static fetchComments = (req: Request, res: Response) => {
    const post_uid = req.params.postId;
    const page = (!req.query.page) ? 1 : Math.max(parseInt(req.query.page.toString()), 1);
    const limit = 10;
    const offset = (page - 1) * 10;

    CommentModel.fetchByPostUID(post_uid, offset, limit).then(result => {
        return res.status(200).send(result);
    }).catch(error => {
        return res.status(500).send(error);
    })
  }
}

export default socialMediaController;
