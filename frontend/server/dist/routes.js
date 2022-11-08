"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.Router();
router.get("/", function (req, res) {
    res.send("Server working!").status(200);
});
// Catch any unresolved url requests and redirects to correct page (404 view):
// router.get("*", (req: Request, res: Response) =>
//   res.status(404).redirect("/404")
// );
exports.default = router;
