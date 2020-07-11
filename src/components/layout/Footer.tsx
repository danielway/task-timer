import React from 'react';
import { Box, Divider, Link } from '@material-ui/core';

function Footer() {
  return (
    <Box>
      <Divider variant="middle" />
      <Box marginTop="15px" marginBottom="15px" textAlign="center">
        Created by{' '}
        <Link href="https://www.danieldway.com" color="secondary">
          Daniel Way
        </Link>{' '}
        under the MIT License.
        <Link
          style={{ marginLeft: '10px' }}
          href="https://github.com/danielway/task-timer"
          color="secondary"
        >
          Contribute or fork on GitHub.
        </Link>
      </Box>
    </Box>
  );
}

export default Footer;
