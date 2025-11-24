# Cron Job Verification Guide

This guide explains how to verify that the Redis keepalive cron job is working correctly on Vercel.

## 🔍 How to Verify the Cron Job is Running

### 1. **Check Vercel Dashboard**

After deploying to Vercel:

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Cron Jobs**
3. You should see a cron job listed:
   - **Path**: `/api/keepalive`
   - **Schedule**: `0 0 * * *` (Daily at midnight UTC)

### 2. **Test the Endpoint Manually**

You can test the keepalive endpoint at any time:

```bash
# Test the endpoint
curl https://your-project.vercel.app/api/keepalive

# Check the status
curl https://your-project.vercel.app/api/keepalive/status
```

**Expected Response:**

```json
{
  "status": "ok",
  "message": "Redis keepalive successful",
  "timestamp": "2024-01-15T00:00:00.000Z",
  "redisConnected": true,
  "isCronJob": false,
  "nextScheduledRun": "Daily at 00:00 UTC"
}
```

### 3. **Check Execution Logs**

#### On Vercel Dashboard:

1. Go to **Deployments** → Select your latest deployment
2. Click on **Functions** tab
3. Look for `/api/keepalive` function
4. Check the **Logs** tab for execution history

#### What to Look For:

- `[KEEPALIVE]` log entries with timestamps
- Success messages: `[KEEPALIVE] <timestamp> - Success: true`
- Any error messages if something fails

### 4. **Monitor Status Endpoint**

The `/api/keepalive/status` endpoint shows:

- Last execution timestamp
- Whether it was successful
- Cron schedule information

**Example Response:**

```json
{
  "status": "ok",
  "lastExecution": {
    "timestamp": "2024-01-15T00:00:00.000Z",
    "success": true
  },
  "cronSchedule": "0 0 * * * (Daily at 00:00 UTC)",
  "endpoint": "/api/keepalive",
  "vercelCronConfigured": true
}
```

### 5. **Verify Cron Job Execution**

#### Option A: Check Vercel Function Logs

1. Wait until after midnight UTC (when the cron should run)
2. Check Vercel dashboard → Deployments → Functions → Logs
3. Look for log entries around 00:00 UTC

#### Option B: Use Status Endpoint

1. After the scheduled time, call:
   ```bash
   curl https://your-project.vercel.app/api/keepalive/status
   ```
2. Check if `lastExecution.timestamp` shows a recent execution

#### Option C: Set Up Monitoring

You can set up external monitoring (e.g., UptimeRobot, Pingdom) to:

- Ping `/api/keepalive/status` every hour
- Alert you if the last execution is older than 25 hours

## 🧪 Testing Locally

To test the endpoint locally:

```bash
# Start the dev server
npm run dev

# In another terminal, test the endpoint
curl http://localhost:4000/api/keepalive

# Check status
curl http://localhost:4000/api/keepalive/status
```

## ⚠️ Troubleshooting

### Cron Job Not Appearing in Vercel Dashboard

1. **Check `vercel.json`**:
   - Ensure `crons` array is present
   - Verify the path matches your endpoint: `/api/keepalive`
   - Check the schedule format: `0 0 * * *`

2. **Redeploy**:

   ```bash
   vercel --prod
   ```

3. **Check Vercel CLI**:
   ```bash
   vercel cron ls
   ```

### Cron Job Not Executing

1. **Check Logs**:
   - Look for errors in Vercel function logs
   - Check if the endpoint is accessible manually

2. **Verify Environment Variables**:
   - Ensure `REDIS_URL` is set in Vercel dashboard
   - Check Settings → Environment Variables

3. **Test Endpoint Manually**:
   - If manual test works but cron doesn't, check Vercel cron configuration
   - Verify the path in `vercel.json` matches the actual endpoint

### Redis Connection Issues

1. **Check Redis URL**:
   - Verify `REDIS_URL` environment variable is correct
   - Test Redis connection manually

2. **Check Logs**:
   - Look for `[KEEPALIVE]` error messages
   - Check if Redis is accessible from Vercel

## 📊 Monitoring Best Practices

1. **Set Up Alerts**:
   - Monitor `/api/keepalive/status` endpoint
   - Alert if last execution is > 25 hours old

2. **Regular Checks**:
   - Check Vercel logs weekly
   - Verify cron job is still configured

3. **Log Retention**:
   - Vercel keeps logs for a limited time
   - Consider external logging if you need longer retention

## 🔐 Security Note

The endpoint is publicly accessible. If you want to restrict it to cron jobs only, you can:

1. Add a secret check:

   ```typescript
   const cronSecret = req.query.secret || req.headers["x-vercel-cron"];
   if (cronSecret !== process.env.CRON_SECRET) {
     return res.status(403).json({ error: "Forbidden" });
   }
   ```

2. Set `CRON_SECRET` in Vercel environment variables
3. Update `vercel.json` to pass the secret:
   ```json
   {
     "crons": [
       {
         "path": "/api/keepalive?secret=your-secret",
         "schedule": "0 0 * * *"
       }
     ]
   }
   ```

## ✅ Verification Checklist

- [ ] Cron job appears in Vercel dashboard (Settings → Cron Jobs)
- [ ] Endpoint is accessible: `curl https://your-project.vercel.app/api/keepalive`
- [ ] Status endpoint works: `curl https://your-project.vercel.app/api/keepalive/status`
- [ ] Logs show `[KEEPALIVE]` entries
- [ ] Redis connection is successful (check `redisConnected: true` in response)
- [ ] Last execution timestamp updates after scheduled run
- [ ] No errors in Vercel function logs
