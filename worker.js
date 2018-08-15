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

const worker = new NodeResque.Worker(
  {
    connection: connectionConfig,
    queues: "*"
  },
  jobs
);

const worker2 = new NodeResque.Worker(
  {
    connection: connectionConfig,
    queues: "*"
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
  await worker.connect();
  await worker.start();
  await worker2.connect();
  await worker2.start();

  await queue.connect();

  for (let i = 0; i < 5; i++) {
    queue.enqueue('app_one', 'deploy', [i, 'app_one']);
    queue.enqueue('app_two', 'deploy', [i, 'app_two']);
  }
})();
