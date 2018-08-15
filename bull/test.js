import Queue from 'bull';
import path from 'path';

const queueMap = new Map();

function getQueue(app) {
  let queue = queueMap.get(app.name);
  if (!queue) {
    queue = Queue(app.name, 'redis://127.0.0.1:6379');
    queue.on('completed', (job, result) => console.log(result));
    queue.on('failed', (job, err) => console.error(err));
    queue.process(1, path.resolve(__dirname, 'deployer.js'));
    queueMap.set(app.name, queue);
  }
  return queue;
}


async function deployApp(app) {
  const queue = getQueue(app);
  await queue.add({ app });
  console.log(`[API] processed ${app.name} v${app.version}`)
}

async function attack() {
  await deployApp({ name: 'okr', version: 1 });
  await deployApp({ name: 'okr', version: 2 });
  await deployApp({ name: 'orgstruct', version: 1 });
  await deployApp({ name: 'okr', version: 3 });
  await deployApp({ name: 'orgstruct', version: 2 });
  await deployApp({ name: 'orgstruct', version: 3 });
  await deployApp({ name: 'orgstruct', version: 4 });
}

attack();