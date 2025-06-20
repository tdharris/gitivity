import github from '../services/github.js';
import gitlab from '../services/gitlab.js';

// service handlers for lookup
const services = { github, gitlab };

// cmd definition
export default {
    // command usage text
    command: 'export <service> <token>',

    // command description text for the CLI
    describe: 'Exports a sorted array of activity.',

    // command argument builder
    builder: function build(args) {
        return args
            .positional('service', {
                choices: Object.keys(services).sort(),
                describe: 'The name of the service to export from.',
            })
            .positional('token', {
                describe: 'The token of the account to authenticate with.',
            })
            .option('from', {
                type: 'string',
                description: 'A lower bound timestamp to export from.',
            })
            .option('host', {
                type: 'string',
                description:
                    'Custom host URL (e.g., https://gitlab.example.com, https://github.example.com/api/v3).',
            })
            .option('ssl-no-verify', {
                type: 'boolean',
                description: 'Disable SSL certificate verification (insecure).',
            })
            .alias('f', 'from')
            .alias('h', 'host')
            .require('service')
            .require('token');
    },

    // command handler definition
    handler: async function (args) {
        // allow re-use and stream overriding
        let stream = args.stream || process.stdout;

        // read back all actions from the selected service
        for await (let action of services[args.service](args)) {
            stream.write(JSON.stringify(action));
            stream.write('\n');
        }
    },
};
