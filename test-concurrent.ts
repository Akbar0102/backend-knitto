import axios from 'axios'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjo0LCJlbWFpbCI6ImFrYmFyQG1haWwuY29tIiwiaWF0IjoxNzQ3MzgxNzM0LCJleHAiOjE3NDczODUzMzR9.JMULV7g1wMAq0TAjF6pLN6EEd5xCM53dx_oEXwhrrtE'

async function sendRequest(i: number): Promise<void> {
  try {
    const res = await axios.post('http://localhost:3000/api/v1/invoice', {
      customer_name: `Customer ${i}`
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(`[${i}] Success: ${res.data.data}`)
  } catch (err: any) {
    console.error(`[${i}] Error:`, err.response?.data || err.message)
  }
}

async function main() {
  const tasks: Promise<void>[] = []  // ✅ Explicitly typed
  for (let i = 1  i <= 10  i++) {
    tasks.push(sendRequest(i))
  }

  await Promise.all(tasks)
}

main() 
