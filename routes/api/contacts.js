const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const Joi = require("joi");
const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});
router.get("/", async (req, res, next) => {
  const contact = await listContacts();
  console.log("CONTACT", contact);
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      contact,
    },
  });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
    return;
  }
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      contact,
    },
  });
});

router.post("/", async (req, res, next) => {
  const contact = await addContact(req.body);
  const { error } = contactSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "missing required name field",
    });
    return;
  }
  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      contact,
    },
  });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await removeContact(contactId);
  if (!contact) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
    return;
  }
  res.status(200).json({
    status: "success",
    code: 200,
    message: "contact deleted",
  });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { error } = contactSchema.validate(req.body);
  const contact = await updateContact(contactId, req.body);
  if (!contact) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
  if (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "missing fields",
    });
  }
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      contact,
    },
  });
});

module.exports = router;
