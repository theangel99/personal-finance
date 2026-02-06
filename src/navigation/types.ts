import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  AddTransaction: { transactionId?: string };
  EditTransaction: { transactionId: string };
};

export type MainTabsParamList = {
  Overview: undefined;
  Transactions: undefined;
  Analytics: undefined;
  Settings: undefined;
};
