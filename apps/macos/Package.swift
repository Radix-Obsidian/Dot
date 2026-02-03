// swift-tools-version: 6.2
// Package manifest for the Dot macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "Dot",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "DotIPC", targets: ["DotIPC"]),
        .library(name: "DotDiscovery", targets: ["DotDiscovery"]),
        .executable(name: "Dot", targets: ["Dot"]),
        .executable(name: "dot-mac", targets: ["DotMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/DotKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "DotIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "DotDiscovery",
            dependencies: [
                .product(name: "DotKit", package: "DotKit"),
            ],
            path: "Sources/DotDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "Dot",
            dependencies: [
                "DotIPC",
                "DotDiscovery",
                .product(name: "DotKit", package: "DotKit"),
                .product(name: "DotChatUI", package: "DotKit"),
                .product(name: "DotProtocol", package: "DotKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/Dot.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "DotMacCLI",
            dependencies: [
                "DotDiscovery",
                .product(name: "DotKit", package: "DotKit"),
                .product(name: "DotProtocol", package: "DotKit"),
            ],
            path: "Sources/DotMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "DotIPCTests",
            dependencies: [
                "DotIPC",
                "Dot",
                "DotDiscovery",
                .product(name: "DotProtocol", package: "DotKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
