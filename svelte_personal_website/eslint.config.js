import prettier from "eslint-config-prettier";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import { fileURLToPath } from "node:url";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));
const tsconfigRootDir = fileURLToPath(new URL("./", import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir
			},
			globals: { ...globals.browser, ...globals.node }
		}
	},
	js.configs.recommended,
	...ts.configs.strictTypeChecked,
	...ts.configs.stylisticTypeChecked,
	...svelte.configs["flat/recommended"],
	...svelte.configs["flat/prettier"],
	prettier,
	{
		rules: {
			quotes: ["error", "double", { avoidEscape: true }],
			"no-undef": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_"
				}
			],
			"svelte/require-each-key": "warn"
		}
	},
	{
		files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: [".svelte"],
				parser: ts.parser,
				svelteConfig
			}
		},
		rules: {
			quotes: "off"
		}
	}
);
