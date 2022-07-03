const UserSchema = require("../schema/user");
const router = require("express").Router();
const verifyToken = require("../controller/tokenCheck");
const { inviteCheck } = require("../controller/validateData");
const invitation = require("../schema/invitation");
const pendingInvitation = require("../socket/invitationLive");

router.post("/invite", verifyToken, inviteCheck, async (req, res) => {
  try {
    let email = req.body.email.toLowerCase();
    if (email === req.user.email.toLowerCase())
      return res.status(409).send("you can't add yourself as friend");
    let targetUser = await UserSchema.findOne({ email });
    if (!targetUser) return res.status(404).send("Friend Not Found");
    const hasInvited = await invitation.findOne({
      senderId: req.user.userId,
      receiverId: targetUser._id,
    });
    if (hasInvited) return res.status(409).send("Invitation has been send");
    const alreadyFriend = targetUser.friends.find(
      (item) => item === req.user.userId
    );
    if (alreadyFriend) return res.status(409).send("Friend already added");

    const invite = await invitation.create({
      senderId: req.user.userId,
      receiverId: targetUser._id,
    });

    pendingInvitation(targetUser._id);
    return res.status(200).send("Invitation send successfully");
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});
module.exports = router;
