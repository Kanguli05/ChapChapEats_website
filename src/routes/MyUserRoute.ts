import express, { RequestHandler } from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateMyUserRequest } from "../middleware/validation";


const router = express.Router();

router.get("/", jwtCheck, async (req, res, next) => {
  try {
    await jwtParse(req, res, next);
    next();
  } catch (error) {
    next(error);
  }
}, (req, res, next) => {
  MyUserController.getCurrentUser(req, res).catch((error) => {
    next(error);
  });
});
//router.get("/", jwtCheck, jwtParse );

//router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser)

// router.post("/", (req, res) => MyUserController.createCurrentUser(req, res));
//router.post("/", MyUserController.createCurrentUser);

router.post("/", jwtCheck, (req, res, next) => {
    MyUserController.createCurrentUser(req, res).catch((error) => {
      next(error);
    });
});

/*router.post("/", async (req, res, next) => {
    try {
        const result = await MyUserController.createCurrentUser(req, res);
        res.json(result);  // Send the result back as a JSON response
    } catch (error) {
        next(error);  // Forward the error to the error handling middleware
    }
}); */



//router.put("/", MyUserController.updateCurrentUser);
router.put("/", (req, res, next) => {
    MyUserController.updateCurrentUser(req, res).catch((error) => {
      next(error);
    });
});

/*router.put("/", (req, res, next) => {
    jwtParse(req, res, next).then((result) => {
      next(result);
    }).catch((error) => {
      next(error);
    });
}); */


//router.put("/",  jwtCheck, validateMyUserRequest);
router.put("/", jwtCheck, (req, res, next) => {
    validateMyUserRequest.forEach((validation) => {
      validation(req, res, next);
    });
  
  } );
  

router.put("/", (req, res, next) => {
    jwtParse(req, res, next);
  });
/*router.put("/", jwtCheck, (req, res, next) => {
    validateMyUserRequest.forEach((validation) => {
        validation(req, res, next);
    });
}); */
//router.use("/", jwtParse);

export default router;