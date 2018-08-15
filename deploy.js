const sleep = async time => new Promise(resolve => setTimeout(resolve, time));

export default async (a) => {
  console.log(`deploy started ${a}`);
  await sleep(5000);
  console.log(`deploy finished ${a}`);
};
