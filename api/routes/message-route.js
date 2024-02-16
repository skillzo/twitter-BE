const router = require("express").Router();
const Message = require("../model/Message");

//send a message
router.post("/create", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get exiting conversation users to a coonversation
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

// {
//   "conversationId": "65b6a173d68bbca5d5261aa0",
//   "sender": "6592a8ef4dda4ee29cf73309",
//   "text": "testing the reciever  on BE"
// }

module.exports = router;
