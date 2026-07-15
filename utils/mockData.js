const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const mockTokens = {
  access: 'mock-access-token-nara-2026',
  refresh: 'mock-refresh-token-nara-2026',
};

export const mockMember = {
  id: 1,
  full_name: 'Olatunji Emmanuel',
  first_name: 'Emmanuel',
  email: 'olatunjie335@gmail.com',
  phone: '07046708198',
  bank_account: '0123456789',
  account_number: '0123456789',
  standing_order_info: 'GTBank - 300,000/month',
  savings_goal: 'LAND',
  contribution_tier: 300000,
  insurance_status: 'Active',
  group_name: 'Land Owambe',
  joined_at: '2026-01-15T00:00:00Z',
};

export const mockDashboard = {
  first_name: 'Emmanuel',
  group_name: 'Land Owambe',
  monthly_pot: 1800000,
  member_count: 6,
  current_month: 2,
  total_months: 6,
  pot_month: 'August 2026',
  total_contributed: 600000,
  next_deduction: {
    amount: 300000,
    date: '3 April 2026',
    bank: 'GTBank',
    status: 'scheduled',
  },
  recent_activities: [
    { id: 1, type: 'contribution', description: 'Monthly contribution of ₦300,000 processed', date: '3 Mar 2026' },
    { id: 2, type: 'member', description: 'Funke joined Land Owambe', date: '28 Feb 2026' },
    { id: 3, type: 'pot', description: 'Chidi received the February pot of ₦1,800,000', date: '15 Feb 2026' },
  ],
};

export const mockGroup = {
  name: 'Land Owambe',
  goal_type: 'Land',
  contribution_tier: 300000,
  max_members: 6,
  monthly_pot: 1800000,
  current_cycle_month: 2,
  total_months: 6,
};

export const mockMembers = [
  { id: 1, full_name: 'Olatunji Emmanuel', collects_month: 'July 2026', status: 'active', months_completed: 1 },
  { id: 2, full_name: 'Chidi Okonkwo', collects_month: 'February 2026', status: 'collected', months_completed: 6 },
  { id: 3, full_name: 'Funke Adebayo', collects_month: 'March 2026', status: 'collected', months_completed: 5 },
  { id: 4, full_name: 'Yakubu Suleiman', collects_month: 'April 2026', status: 'active', months_completed: 3 },
  { id: 5, full_name: 'Ngozi Eze', collects_month: 'May 2026', status: 'active', months_completed: 2 },
  { id: 6, full_name: 'Kofi Mensah', collects_month: 'June 2026', status: 'active', months_completed: 1 },
];

export const mockGroupMatch = {
  group_id: '123e4567-e89b-12d3-a456-426614174000',
  group_name: 'Land Owambe',
  monthly_pot: 1800000,
  member_count: 6,
  pot_month: 'August 2026',
  cycle_length: 6,
};

export const mockCover = {
  premium_amount: 15000,
  coverage_amount: 1800000,
  provider: 'AXA Mansard',
  status: 'ACTIVE',
};

export const mockContributions = [
  { month: 'January 2026', month_year: '2026-01', deduction_date: '3 Jan 2026', transaction_ref: 'TXN-001', amount: 300000, status: 'PROCESSED', is_pot: false },
  { month: 'February 2026', month_year: '2026-02', deduction_date: '3 Feb 2026', transaction_ref: 'TXN-002', amount: 300000, status: 'PROCESSED', is_pot: false },
  { month: 'February 2026 (Pot)', month_year: '2026-02', deduction_date: '15 Feb 2026', transaction_ref: 'POT-001', amount: 1800000, status: 'PROCESSED', is_pot: true },
  { month: 'March 2026', month_year: '2026-03', deduction_date: '3 Mar 2026', transaction_ref: 'TXN-003', amount: 300000, status: 'PROCESSED', is_pot: false },
];

export const mockNotifications = [
  { id: '1', title: 'Contribution due', body: 'Your March contribution of ₦300,000 will be deducted on 3 April.', created_at: '2026-03-28T08:00:00Z', is_read: false },
  { id: '2', title: 'Pot received', body: 'Chidi Okonkwo received the February pot of ₦1,800,000.', created_at: '2026-02-15T12:00:00Z', is_read: false },
  { id: '3', title: 'New member', body: 'Funke Adebayo has joined your circle Land Owambe.', created_at: '2026-02-28T09:00:00Z', is_read: true },
  { id: '4', title: 'Standing order updated', body: 'Your standing order of ₦300,000/month has been confirmed with GTBank.', created_at: '2026-01-10T14:00:00Z', is_read: true },
];

let registeredMember = null;

export async function mockAuthRegister(fullName, email, phone, password, bank, accountNumber, bvn, nin) {
  await delay();
  registeredMember = {
    id: 1,
    full_name: fullName,
    email,
    phone,
    bank,
    account_number: accountNumber,
    bvn,
    nin,
    joined_at: new Date().toISOString(),
  };
  return {};
}

export async function mockAuthVerifyOtp(phone, otp) {
  console.log(`\n[MOCK] Any 6-digit OTP works. You entered: ${otp}\n`);
  await delay();
  return { ...mockTokens };
}

export async function mockAuthLogin(email, password) {
  await delay();
  return { ...mockTokens };
}

export async function mockRefreshToken(token) {
  await delay();
  return { access: 'mock-refreshed-access-token' };
}

export async function mockGetProfile() {
  await delay();
  if (registeredMember) {
    return { data: { ...mockMember, ...registeredMember } };
  }
  return { data: { ...mockMember } };
}

export async function mockGetDashboard() {
  await delay();
  return { data: { ...mockDashboard } };
}

export async function mockGetNotifications() {
  await delay();
  return { data: [...mockNotifications] };
}

export async function mockGetGroup() {
  await delay();
  return { data: { ...mockGroup } };
}

export async function mockGetMembers() {
  await delay();
  return { data: [...mockMembers] };
}

export async function mockGetGroupMatch() {
  await delay();
  return { data: { ...mockGroupMatch } };
}

export async function mockGetCover() {
  await delay();
  return { data: { ...mockCover } };
}

export async function mockGetContributions() {
  await delay();
  return { data: [...mockContributions] };
}

export async function mockEmpty() {
  await delay();
  return {};
}
