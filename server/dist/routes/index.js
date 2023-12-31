"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const yourController_1 = __importDefault(require("../controllers/yourController"));
const router = express_1.default.Router();
router.post('/validate', yourController_1.default.validate);
router.post('/update', yourController_1.default.update);
exports.default = router;
//# sourceMappingURL=index.js.map