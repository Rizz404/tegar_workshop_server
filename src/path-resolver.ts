import { addAliases } from "module-alias";
import path from "path";

// Register aliases
addAliases({
  "@": path.join(__dirname),
});
