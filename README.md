# JoyTask - 楽しみと課題の時間管理アプリ 🎯

このアプリは、日々の活動を「楽しみ」と「課題」の 2 つのカテゴリーで時間管理できるシンプルなタイマーアプリです。

## 機能

- 「楽しみ」と「課題」の 2 つのタイマー
- スワイプジェスチャーで計測完了
- 日別の時間記録
- 累計時間の表示
- 統計画面での時間管理の可視化

## 使い方

1. タイマーの開始

   - 「Joy」ボタン：楽しみの時間を計測
   - 「Task」ボタン：課題の時間を計測
   - ※同時に両方のタイマーを動かすことはできません

2. タイマーの終了

   - 画面を上にスワイプすると計測完了
   - 計測した時間は自動的に保存され、統計に反映されます

3. 統計の確認
   - 「Stats」タブで日々の記録を確認
   - 各日の記録は個別に削除可能

## 開発者向け情報

このプロジェクトは[Expo](https://expo.dev)を使用して作成されています。

### セットアップ

1. 依存関係のインストール

   ```bash
   npm install
   ```

2. アプリの起動

   ```bash
   npx expo start
   ```

起動後、以下の方法でアプリを実行できます：

- [開発ビルド](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android エミュレータ](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS シミュレータ](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

### 技術スタック

- React Native
- Expo
- TypeScript
- React Native Gesture Handler
- AsyncStorage

### 参考リンク

- [Expo ドキュメント](https://docs.expo.dev/)
- [Expo GitHub](https://github.com/expo/expo)
- [Discord コミュニティ](https://chat.expo.dev)
