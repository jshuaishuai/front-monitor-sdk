/*
 * @Descripttion: Do
 * @Author: 姜帅帅
 * @LastEditTime: 2021-04-24 21:45:41
 */
import babel from "rollup-plugin-babel";
import typescript from "@rollup/plugin-typescript"; // ts 支持
import { terser } from "rollup-plugin-terser"; // terser是支持ES6 +的JavaScript压缩器工具包
// rollup.js编译源码中的模块引用默认只支持 ES6+的模块方式import/export
import nodeResolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json";
import path from "path";
import dts from "rollup-plugin-dts";

const resolve = (...args) => path.resolve(...args);
const extensions = [".ts"];
const babelRuntimeVersion = pkg.dependencies["@babel/runtime"].replace(
    /^[^0-9]*/,
    ""
);
const makeExternalPredicate = (externalArr) => {
    if (externalArr.length === 0) {
        return () => false;
    }
    const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
    return (id) => pattern.test(id);
};

export default [
    {
        input: "src/monitor.ts",
        output: {
            file: "es/monitor.js", //输出文件的路径和名称
            format: "es", //五种输出格式：amd/es6/iife/umd/cjs
            indent: false,
            // name: "bundleName", //当format为iife和umd时必须提供，将作为全局变量挂在window下
        },
        external: makeExternalPredicate([
            ...Object.keys(pkg.dependencies || {}),
        ]),
        plugins: [
            nodeResolve({
                extensions,
            }),
            typescript({ sourceMap: false }),
            babel({
                exclude: "node_modules/**",
                plugins: [
                    [
                        "@babel/plugin-transform-runtime",
                        { version: babelRuntimeVersion, useESModules: true },
                    ],
                ],
            }),
        ],
    },
    {
        input: "src/monitor.ts",
        output: {
            file: "lib/monitor.js", //输出文件的路径和名称
            format: "cjs", //五种输出格式：amd/es6/iife/umd/cjs
            indent: false,
        },
        external: makeExternalPredicate([
            ...Object.keys(pkg.dependencies || {}),
        ]),
        plugins: [
            nodeResolve({
                extensions,
            }),
            typescript({
                sourceMap: false,
            }),
            babel({
                exclude: "node_modules/**",
                plugins: [
                    [
                        "@babel/plugin-transform-runtime",
                        { version: babelRuntimeVersion },
                    ],
                ],
            }),
            terser(),
        ],
    },
    {
        // 生成 .d.ts 类型声明文件
        input: "./src/monitor.ts",
        output: {
            file: resolve("./", pkg.types),
            format: "es",
        },
        plugins: [dts()],
    },
];
