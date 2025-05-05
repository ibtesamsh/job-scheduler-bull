// const jobQueue = require('./jobQueue');


// jobQueue.process(async (job) => {
//   console.log(`Processing job ${job.id} with data:`, job.data);

 
//   if (!job.data.email) {
//     throw new Error('Email is required');
//   }


//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   return { status: 'done', sentTo: job.data.email };
// // done()
// });


// jobQueue.on('completed', (job, result) => {
//   console.log(`Job ${job.id} completed successfully with result:`, result);
// });


// jobQueue.on('failed', (job, err) => {
//   console.error(`Job ${job.id} failed with error:`, err.message);
// });












const jobQueue = require('./jobQueue');

jobQueue.process(async (job) => {
  const { email, message, type, shouldFail } = job.data;

  console.log(`🛠️  Processing Job ${job.id} [Type: ${type}] for ${email}`);

  await new Promise(res => setTimeout(res, 1000));

  if (shouldFail && job.attemptsMade < 4) {
    console.warn(`⚠️  Job ${job.id} failing intentionally (Attempt ${job.attemptsMade + 1})`);
    throw new Error('Intentional Failure');
  }

 
  switch (type) {
    case 'welcome':
      console.log(`👋 Sending WELCOME email to ${email}: "${message}"`);
      break;
    case 'reminder':
      console.log(`⏰ Sending REMINDER to ${email}: "${message}"`);
      break;
    case 'report':
      console.log(`📊 Generating REPORT for ${email}`);
      break;
    default:
      console.log(`ℹ️  Unknown job type for ${email}`);
  }

  return { success: true };
});


jobQueue.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed. Result:`, result);
});


jobQueue.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed after ${job.attemptsMade} attempts:`, err.message);
});
