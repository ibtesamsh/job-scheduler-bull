// const jobQueue = require('./jobQueue');


// async function addJob(data) {
//   const job = await jobQueue.add(data); 
//   console.log(`Job added with ID: ${job.id}`);
// }

// addJob({ email: 'user@example.com', message: 'Welcome!' });



const jobQueue = require('./jobQueue');
const { faker } = require('@faker-js/faker');


function generateJobData() {
  return {
    email: faker.internet.email(),
    message: faker.lorem.sentence(),
    type: faker.helpers.arrayElement(['welcome', 'reminder', 'report']),
    shouldFail: Math.random() < 0.4, 
    createdAt: new Date().toISOString()
  };
}

// Main function: keep producing jobs in a loop
async function startProducingJobs() {
  console.log('🚀 Job producer started. Press Ctrl+C to stop.');
  let jobCount = 1;

  while (true) {
    const jobData = generateJobData();

    try {
      const job = await jobQueue.add(jobData, {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: true,
        removeOnFail: false
      });

      console.log(`📤 Job #${jobCount} added (ID: ${job.id}) | Type: ${jobData.type} | FailIntent: ${jobData.shouldFail}`);
      jobCount++;
    } catch (err) {
      console.error('❌ Failed to add job:', err.message);
    }

    await delay(2000); 
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


startProducingJobs();

