import { execSync } from "child_process";
import { writeFileSync } from "fs";

const numOfNewCommitInBranch = parseInt(execSync("git rev-list --count HEAD").toString()) - 1;

console.log(`numOfNewCommitInBranch=${numOfNewCommitInBranch}`);

const diff = execSync(
	`git diff HEAD~${numOfNewCommitInBranch} packages/create-cloudflare/src/frameworks/package.json`
).toString();


console.log('\nDIFF ===================\n\n');

console.log(diff);

console.log('\nFFID ===================\n\n');


const changedPackages =
	diff
		.match(/-\s*".*?":\s".*?",?/g)
		?.map((match) => match.match(/-\s*"(.*)":/)?.[1])
		.filter(Boolean) ?? [];

const changes = changedPackages.map((pkg) => {
	const getPackageChangeRegex = (addition) =>
		new RegExp(`${addition ? "\\+" : "-"}\\s*"${pkg}":\\s"(.*)",?`);

	const from = diff.match(getPackageChangeRegex(false))?.[1];
	const to = diff.match(getPackageChangeRegex(true))?.[1];

	if (!from || !to) {
		throw new Error(
			`Unexpected changes for package ${pkg} (could not determine upgrade)`
		);
	}

	return {
		package: pkg,
		from,
		to,
	};
});

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
