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
    const hasInvited2 = await invitation.findOne({
      senderId: targetUser._id,
      receiverId: req.user.userId,
    });
    if (hasInvited || hasInvited2)
      return res.status(409).send("Invitation has been send");
    const alreadyFriend = targetUser.friends.find(
      (item) => item.toString() === req.user.userId.toString()
    );
    if (alreadyFriend) return res.status(409).send("Friend already added");

    const invite = await invitation.create({
      senderId: req.user.userId,
      receiverId: targetUser._id,
    });

    pendingInvitation(targetUser._id);
    return res.status(200).send("Invitation send successfully");
  } catch (error) {
    console.log("Invitation send", error.message);
    return res.status(500).send("Server Error");
  }
});

router.post("/invite/accept", verifyToken, async (req, res) => {
  try {
    const id = req.body.inviteId;
    if (!id) return res.status(404).send("Invite ID not Found");
    const invite = await invitation.findById(id);
    if (!invite) return res.status(404).send("No Invite Found");
    const { senderId, receiverId } = invite;
    const user1 = await UserSchema.findById(senderId);
    const user2 = await UserSchema.findById(receiverId);
    if (!user1 || !user2) {
      await invite.remove();
      return res.status(404).send("User not exist");
    }
    user1.friends = [...user1.friends, receiverId];
    user2.friends = [...user2.friends, senderId];
    await user1.save();
    await user2.save();
    await invite.remove();
    updateFriends(req.user.userId);
    pendingInvitation(req.user.userId);
    return res.status(200).send("Invitation Accepted");
  } catch (error) {
    console.log("Invitation accept", error.message);
    return res.status(500).send("Server Error");
  }
});
router.post("/invite/reject", verifyToken, async (req, res) => {
  try {
    const id = req.body.inviteId;
    if (!id) return res.status(404).send("Invite ID not Found");
    const hasInvite = await invitation.exists({ _id: id });
    if (!hasInvite) return res.status(404).send("No Invite Found");
    await invitation.findByIdAndDelete(id);
    pendingInvitation(req.user.userId);
    return res.status(200).send("Invitation Rejected");
  } catch (error) {
    console.log("Invitation reject", error.message);
    return res.status(500).send("Server Error");
  }
});
// Get All Invitations
router.get("/invite", async (req, res) => {
  try {
    const hasInvited = await invitation.find();
    if (hasInvited) return res.status(200).json(hasInvited);
    else return res.status(404).send("No invitations");
  } catch (error) {
    console.log("Get All Invitations", error.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
