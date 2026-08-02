/** Day-rollover maths shared by the ad quotas in `@/store/ads.store`. */

export type AdQuotaType = {
  /** Local calendar day the count belongs to, as YYYY-MM-DD. Empty until the first ad. */
  day: string;
  count: number;
};

/** Local calendar day as YYYY-MM-DD, so quotas roll over at the user's own midnight. */
export const getLocalDay = () => {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');

  return `${now.getFullYear()}-${month}-${day}`;
};

/** A count stored under an earlier day is stale, so the full limit is available again. */
export const getRemaining = (quota: AdQuotaType, limit: number) => (quota.day === getLocalDay() ? Math.max(0, limit - quota.count) : limit);

/** Records one impression, restarting the count when the day has rolled over. */
export const spendOne = (quota: AdQuotaType): AdQuotaType => {
  const today = getLocalDay();

  return quota.day === today ? { day: today, count: quota.count + 1 } : { day: today, count: 1 };
};
