import challengeController from "../controllers/challenge.controllers";
import paths from "../shared/paths";

const challengeRouter = express.Router();

// POST /api/v1/challenges
challengeRouter.post(paths.challenge, challengeController.createChallenge);

export default challengeRouter;
