import NodeResque from 'node-resque';
import deploy from './deploy';

const connectionConfig = {
  pkg: 'ioredis',
  host: 'localhost',
  password: null,
  port: 6379,
  database: 0
};

const jobs = {
  deploy: {
    perform: deploy
  }
};

const worker = new NodeResque.Worker(
  {
    connection: connectionConfig,
    queues: ['default']
  },
  jobs
);

const scheduler = new NodeResque.Scheduler({
  connection: connectionConfig
});

const queue = new NodeResque.Queue(
  {
    connection: connectionConfig
  },
  jobs
);

(async () => {
  await worker.connect();
  await worker.start();

  await scheduler.connect();
  await scheduler.start();

  await queue.connect();

  for (let i = 0; i < 5; i++) {
    queue.enqueue('default', 'deploy', [1]);
  }
})();
