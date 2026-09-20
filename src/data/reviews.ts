/**
 * Client reviews.
 *
 * These are written as representative examples so the section is complete and
 * presentable from the first build. Replace the quotes and attributions with
 * your own before the site goes live; the aggregate rating shown on the page
 * is calculated from whatever is listed here.
 */

export type Review = {
  id: string;
  /** Whole stars, 1 to 5. */
  rating: number;
  /** A few words pulled from the quote, used as the card heading. */
  headline: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  sector: string;
};

export const reviews: Review[] = [
  {
    id: "r1",
    rating: 5,
    headline: "They studied the shop floor before proposing anything",
    quote:
      "We had been running three disconnected systems on the shop floor, and nobody could tell us what our real throughput was. The rollout was staged so carefully that we never lost a day of production, and the predictive maintenance model flagged a spindle failure in the second month that would have cost us a week. What impressed me most was how much time was spent watching how we actually work before a single line was written.",
    author: "T. Nakamura",
    role: "Plant Operations Director",
    organization: "Automotive parts manufacturer, Aichi",
    sector: "Manufacturing",
  },
  {
    id: "r2",
    rating: 5,
    headline: "Our requirements were questioned, not just accepted",
    quote:
      "Working alongside clinical staff is rarely straightforward, and we valued that our requirements were questioned rather than simply written down. Reception and billing now take our front desk roughly half the time they used to, and the handover documentation was thorough enough that our in-house team picked up maintenance without any difficulty at all.",
    author: "M. Saito",
    role: "Hospital Information Systems Manager",
    organization: "400-bed general hospital",
    sector: "Healthcare",
  },
  {
    id: "r3",
    rating: 5,
    headline: "Launched on the date we agreed",
    quote:
      "Keeping stock in step across our own shop, Rakuten, and Amazon used to occupy one person for most of every morning. That job simply no longer exists. PayPay and card payments went live without a single failed settlement, and we launched on the date we had agreed months earlier, which in my experience is genuinely rare.",
    author: "A. Fujimoto",
    role: "E-Commerce Manager",
    organization: "Apparel brand, Tokyo",
    sector: "Retail & E-Commerce",
  },
  {
    id: "r4",
    rating: 5,
    headline: "The first version was wrong, and that was handled well",
    quote:
      "Route optimization sounds straightforward until you try it with real drivers and real traffic. Our dispatchers were skeptical at first, and they were right to be — the first version did not account for the order in which a truck is actually loaded. That feedback was taken seriously and reworked within two weeks. We now run noticeably shorter routes, and the team trusts the plan it is given.",
    author: "K. Ishikawa",
    role: "Distribution Center Manager",
    organization: "Regional logistics operator",
    sector: "Logistics",
  },
  {
    id: "r5",
    rating: 5,
    headline: "Two summers without a single intervention",
    quote:
      "We are a farming cooperative, not a technology company, and we needed someone willing to spend time in the greenhouses before writing any code. The monitoring system has now run through two summers without a single intervention, and the harvest forecasts have become accurate enough that we plan our shipping around them.",
    author: "H. Ogawa",
    role: "Managing Director",
    organization: "Agricultural cooperative, Nagano",
    sector: "Agriculture",
  },
  {
    id: "r6",
    rating: 5,
    headline: "Every accessibility requirement met on the first review",
    quote:
      "Public procurement brings a great deal of paperwork and a long list of accessibility and security requirements. All of it was met at the first review, which saved us months of correspondence. Residents can now complete most applications from a phone, and My Number Card authentication has worked reliably since the day we opened it.",
    author: "Y. Tanabe",
    role: "Digital Transformation Officer",
    organization: "City government",
    sector: "Public Sector",
  },
  {
    id: "r7",
    rating: 5,
    headline: "Answered with evidence rather than assurance",
    quote:
      "Our compliance team is not easily satisfied, and the fraud detection work was reviewed line by line. Every question came back answered with evidence rather than assurance. False positives fell substantially without our loosening a single threshold, and the audit trail has already stood up to an external examination.",
    author: "S. Mori",
    role: "Head of Risk",
    organization: "Regional financial institution",
    sector: "Finance",
  },
  {
    id: "r8",
    rating: 5,
    headline: "We were never made to feel like a small client",
    quote:
      "We are a small company, and we were quietly worried about being a small client. It never once showed. Invoice OCR now handles the bulk of our monthly processing, the Qualified Invoice System requirements were taken care of before we had even thought to ask about them, and support has been prompt every time we have needed it.",
    author: "R. Kubo",
    role: "Head of Administration",
    organization: "Construction materials supplier",
    sector: "Business Administration",
  },
  {
    id: "r9",
    rating: 5,
    headline: "Told honestly what was not worth building",
    quote:
      "We arrived with a vague ambition to make use of AI and left with something specific and genuinely useful. Knowledge search across our internal documents is now simply part of how the team works. Just as valuable, we were told plainly which parts of our original wish list were not worth building, and that honesty saved us a considerable amount of money.",
    author: "N. Hayashi",
    role: "Chief Technology Officer",
    organization: "Professional services firm",
    sector: "Enterprise AI",
  },
];

export const reviewCount = reviews.length;

export const averageRating =
  Math.round(
    (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length) *
      10,
  ) / 10;
