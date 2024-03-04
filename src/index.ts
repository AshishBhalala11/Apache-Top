import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs/promises';
import { parseLogFile } from './parser';
import {
    printOverallAnalysedRequests,
    printUniqueVisitorsPerDay,
    printRequestedFiles,
    print404RequestedFiles
} from './printer';

const main = async () => {
    while (true) {
        console.clear();
        try {
            const logData = await fs.readFile('access.log', { encoding: 'utf8' });
            const logEntries = parseLogFile(logData);
            printOverallAnalysedRequests(logEntries);
            printUniqueVisitorsPerDay(logEntries);
            printRequestedFiles(logEntries);
            print404RequestedFiles(logEntries);
        } catch (err) {
            console.log(err);
        }
        await setTimeout(100000);
    }
};

main();
