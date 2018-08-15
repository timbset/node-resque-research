const sleep = async time => new Promise(resolve => setTimeout(resolve, time));

export default async (a, app) => {
  console.log(`deploy ${app} started ${a}`);
  await sleep(10);
  console.log(`deploy ${app} finished ${a}`);
};
