import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Server working!").status(200);
});

// Catch any unresolved url requests and redirects to correct page (404 view):
// router.get("*", (req: Request, res: Response) =>
//   res.status(404).redirect("/404")
// );

export default router;
