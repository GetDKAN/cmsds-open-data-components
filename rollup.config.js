import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: [
    { file: "dist/index.cjs.js", format: "cjs" },
    { file: "dist/index.esm.js", format: "esm" },
  ],
  plugins: [
    external(),
    nodeResolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    commonjs({
      include: ["node_modules/**"],
    }),
    typescript(),
  ],

}
