import { Box, Divider, Link } from "@mui/material";

export const Footer = () => (
  <Box>
    <Divider variant="middle" />
    <Box mt={2} fontSize={13} textAlign="center">
      Created by {websiteLink()} under the MIT License. {repositoryLink()}
    </Box>
    <Box mb={2} fontSize={12} textAlign="center">
      {releaseLink()}
    </Box>
  </Box>
);

const websiteLink = () => (
  <Link href="https://www.danieldway.com" color="secondary">
    Daniel Way
  </Link>
);

const repositoryLink = () => (
  <Link href="https://github.com/danielway/task-timer" color="secondary">
    Contribute or fork on GitHub.
  </Link>
);

const releaseLink = () => (
  <Link
    href="https://github.com/danielway/task-timer/releases/tag/REPLACE_WITH_RELEASE"
    color="secondary"
  >
    vREPLACE_WITH_RELEASE
  </Link>
);
