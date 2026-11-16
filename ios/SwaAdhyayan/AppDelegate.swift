import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  @objc var window: UIWindow? {
    get {
      guard let scene = UIApplication.shared.connectedScenes.first(where: {
        $0.activationState == .foregroundActive || $0.activationState == .foregroundInactive
      }) as? UIWindowScene ?? UIApplication.shared.connectedScenes.first as? UIWindowScene,
            let sceneDelegate = scene.delegate as? SceneDelegate else {
        return nil
      }
      return sceneDelegate.window
    }
    set {
      // no-op
    }
  }

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    true
  }
}
