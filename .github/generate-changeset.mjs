import { execSync } from "child_process";
import { writeFileSync } from "fs";
import collectChangesPackagesChanges from "./collect-c3-packages-changes.cjs";

const changes = collectChangesPackagesChanges();

if (!changes.length) {
	console.warn("No changes detected!!!");
} else {
	const prNumber = process.argv[2];

	writeFileSync(
		`.changeset/c3-frameworks-update-${prNumber}.md`,
		`---
"dependabot-testing": patch
---

${generateChangesetBody(changes)}

`
	);

	execSync("git add .changeset");
	execSync("git commit --amend --no-edit");
	execSync("git push --force-with-lease");
}

function generateChangesetBody(changes) {
	if (changes.length === 1) {
		const { package: pkg, from, to } = changes[0];
		return `C3: Bumped \`${pkg}\` from \`${from}\` to \`${to}\``;
	}

	return `Framework CLI versions updated in C3

The following framework CLI versions have been updated in C3:
${[
	"| package | from | to |",
	"|---------|------|----|",
	...changes.map(
		({ package: pkg, from, to }) => `| \`${pkg}\` | \`${from}\` | \`${to}\` |`
	),
]
	.map((str) => ` ${str}`)
	.join("\n")}
	}
`;
}
