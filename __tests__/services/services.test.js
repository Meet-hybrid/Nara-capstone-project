import api from '../../services/api';
import * as authService from '../../services/authService';
import * as memberService from '../../services/memberService';
import * as onboardingService from '../../services/onboardingService';
import * as groupService from '../../services/groupService';
import * as contributionService from '../../services/contributionService';
import * as standingOrderService from '../../services/standingOrderService';
import * as disbursementService from '../../services/disbursementService';
import * as insuranceService from '../../services/insuranceService';
import * as waitlistService from '../../services/waitlistService';
import * as notificationService from '../../services/notificationService';

jest.mock('../../services/api', () => {
  const mock = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  return {
    __esModule: true,
    default: mock,
  };
});

const mockApi = jest.mocked(api);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('authService', () => {
  test('register posts to /auth/register/ without auth', async () => {
    await authService.register('John', 'j@b.com', '080123', 'pass', 'GTB', '1234567890', '12345678901', '12345678901');
    expect(mockApi.post).toHaveBeenCalledWith(
      '/auth/register/',
      { full_name: 'John', email: 'j@b.com', phone: '080123', password: 'pass', bank: 'GTB', account_number: '1234567890', bvn: '12345678901', nin: '12345678901' },
      false,
    );
  });

  test('verifyOtp posts to /auth/verify-otp/ without auth', async () => {
    await authService.verifyOtp('080123', '123456');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/verify-otp/', { phone: '080123', otp: '123456' }, false);
  });

  test('login posts to /auth/login/ without auth', async () => {
    await authService.login('j@b.com', 'pass');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/login/', { email: 'j@b.com', password: 'pass' }, false);
  });

  test('refreshToken posts to /auth/refresh/ without auth', async () => {
    await authService.refreshToken('tok');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/refresh/', { refresh: 'tok' }, false);
  });

  test('logout posts to /auth/logout/ without auth', async () => {
    await authService.logout('tok');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/logout/', { refresh: 'tok' }, false);
  });

  test('forgotPassword posts to /auth/forgot-password/ without auth', async () => {
    await authService.forgotPassword('080123');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/forgot-password/', { phone: '080123' }, false);
  });

  test('resetPassword posts to /auth/reset-password/ without auth', async () => {
    await authService.resetPassword('080123', '123456', 'newpass');
    expect(mockApi.post).toHaveBeenCalledWith('/auth/reset-password/', { phone: '080123', otp: '123456', new_password: 'newpass' }, false);
  });
});

describe('memberService', () => {
  test('getMyProfile gets /members/me/', async () => {
    await memberService.getMyProfile();
    expect(mockApi.get).toHaveBeenCalledWith('/members/me/');
  });

  test('updateProfile patches /members/me/', async () => {
    await memberService.updateProfile({ full_name: 'New' });
    expect(mockApi.patch).toHaveBeenCalledWith('/members/me/', { full_name: 'New' });
  });

  test('getDashboard gets /members/me/dashboard/', async () => {
    await memberService.getDashboard();
    expect(mockApi.get).toHaveBeenCalledWith('/members/me/dashboard/');
  });

  test('getNotifications gets /members/me/notifications/', async () => {
    await memberService.getNotifications();
    expect(mockApi.get).toHaveBeenCalledWith('/members/me/notifications/');
  });

  test('markNotificationsRead patches /members/me/notifications/read/', async () => {
    await memberService.markNotificationsRead();
    expect(mockApi.patch).toHaveBeenCalledWith('/members/me/notifications/read/');
  });
});

describe('onboardingService', () => {
  test('saveGoal posts goal to /onboarding/goal/', async () => {
    await onboardingService.saveGoal('LAND');
    expect(mockApi.post).toHaveBeenCalledWith('/onboarding/goal/', { goal: 'LAND' });
  });

  test('saveTier posts tier to /onboarding/tier/', async () => {
    await onboardingService.saveTier(300000);
    expect(mockApi.post).toHaveBeenCalledWith('/onboarding/tier/', { tier: 300000 });
  });

  test('getGroupMatch gets /onboarding/match/', async () => {
    await onboardingService.getGroupMatch();
    expect(mockApi.get).toHaveBeenCalledWith('/onboarding/match/');
  });

  test('confirmGroupJoin posts to /onboarding/confirm/', async () => {
    await onboardingService.confirmGroupJoin();
    expect(mockApi.post).toHaveBeenCalledWith('/onboarding/confirm/');
  });
});

describe('groupService', () => {
  test('getGroups gets /groups/groups/', async () => {
    await groupService.getGroups();
    expect(mockApi.get).toHaveBeenCalledWith('/groups/groups/');
  });

  test('getMyGroup gets /groups/my-group/', async () => {
    await groupService.getMyGroup();
    expect(mockApi.get).toHaveBeenCalledWith('/groups/my-group/');
  });

  test('getGroupMembers gets /groups/my-group/members/', async () => {
    await groupService.getGroupMembers();
    expect(mockApi.get).toHaveBeenCalledWith('/groups/my-group/members/');
  });

  test('getGroupById gets /groups/<id>/', async () => {
    await groupService.getGroupById('abc-123');
    expect(mockApi.get).toHaveBeenCalledWith('/groups/abc-123/');
  });
});

describe('contributionService', () => {
  test('getContributions gets /contributions/contributions/', async () => {
    await contributionService.getContributions();
    expect(mockApi.get).toHaveBeenCalledWith('/contributions/contributions/');
  });

  test('logManualContribution posts to /contributions/manual/', async () => {
    await contributionService.logManualContribution({ amount: 50000 });
    expect(mockApi.post).toHaveBeenCalledWith('/contributions/manual/', { amount: 50000 });
  });

  test('getContributionByMonth gets /contributions/<month_year>/', async () => {
    await contributionService.getContributionByMonth('2026-03');
    expect(mockApi.get).toHaveBeenCalledWith('/contributions/2026-03/');
  });
});

describe('standingOrderService', () => {
  test('createStandingOrder posts to /standing-orders/standing-orders/', async () => {
    await standingOrderService.createStandingOrder({ amount: 300000 });
    expect(mockApi.post).toHaveBeenCalledWith('/standing-orders/standing-orders/', { amount: 300000 });
  });

  test('getMyStandingOrder gets /standing-orders/me/', async () => {
    await standingOrderService.getMyStandingOrder();
    expect(mockApi.get).toHaveBeenCalledWith('/standing-orders/me/');
  });

  test('pauseStandingOrder patches /standing-orders/me/pause/', async () => {
    await standingOrderService.pauseStandingOrder();
    expect(mockApi.patch).toHaveBeenCalledWith('/standing-orders/me/pause/');
  });

  test('resumeStandingOrder patches /standing-orders/me/resume/', async () => {
    await standingOrderService.resumeStandingOrder();
    expect(mockApi.patch).toHaveBeenCalledWith('/standing-orders/me/resume/');
  });
});

describe('disbursementService', () => {
  test('getDisbursements gets /disbursements/disbursements/', async () => {
    await disbursementService.getDisbursements();
    expect(mockApi.get).toHaveBeenCalledWith('/disbursements/disbursements/');
  });

  test('processDisbursement posts to /disbursements/process/', async () => {
    await disbursementService.processDisbursement();
    expect(mockApi.post).toHaveBeenCalledWith('/disbursements/process/');
  });
});

describe('insuranceService', () => {
  test('getMyCover gets /insurance/me/', async () => {
    await insuranceService.getMyCover();
    expect(mockApi.get).toHaveBeenCalledWith('/insurance/me/');
  });

  test('fileClaim posts to /insurance/claim/', async () => {
    await insuranceService.fileClaim('sickness');
    expect(mockApi.post).toHaveBeenCalledWith('/insurance/claim/', { reason: 'sickness' });
  });

  test('getClaimStatus gets /insurance/claim/status/', async () => {
    await insuranceService.getClaimStatus();
    expect(mockApi.get).toHaveBeenCalledWith('/insurance/claim/status/');
  });
});

describe('waitlistService', () => {
  test('joinWaitlist posts to /waitlist/waitlist/', async () => {
    await waitlistService.joinWaitlist();
    expect(mockApi.post).toHaveBeenCalledWith('/waitlist/waitlist/');
  });

  test('getWaitlistPosition gets /waitlist/position/', async () => {
    await waitlistService.getWaitlistPosition();
    expect(mockApi.get).toHaveBeenCalledWith('/waitlist/position/');
  });

  test('leaveWaitlist deletes /waitlist/leave/', async () => {
    await waitlistService.leaveWaitlist();
    expect(mockApi.delete).toHaveBeenCalledWith('/waitlist/leave/');
  });
});

describe('notificationService', () => {
  test('registerPushToken posts to /notifications/push-token/', async () => {
    await notificationService.registerPushToken('expo-tok');
    expect(mockApi.post).toHaveBeenCalledWith('/notifications/push-token/', { push_token: 'expo-tok' });
  });
});
