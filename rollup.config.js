import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default {
  plugins: [
    typescript({
      tsconfigOverride: {
        declarationDir: __dirname + "/src",
        compilerOptions: {
          module: "es2015",
          declaration: true,
          moduleResolution: "node"
        }
      }
    })
  ],
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs"
    },
    {
      file: pkg.module,
      format: "es"
    }
  ],
  external: [
    // ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ]
};
