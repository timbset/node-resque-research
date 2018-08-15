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
    plugins: ['JobLock'],
    pluginOptions: {
      JobLock: {}
    },
    perform: deploy
  }
};

const worker = new NodeResque.MultiWorker(
  {
    connection: connectionConfig,
    queues: ['default'],
    minTaskProcessors: 1,
    maxTaskProcessors: 100,
    checkTimeout: 1000,
    maxEventLoopDelay: 10
  },
  jobs
);

const queue = new NodeResque.Queue(
  {
    connection: connectionConfig
  },
  jobs
);

(async () => {
  await worker.start();
  await queue.connect();

  for (let i = 0; i < 5; i++) {
    queue.enqueue('default', 'deploy', [1]);
  }
})();
