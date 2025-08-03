#!/bin/bash

echo "🔍 Starting enhanced error monitoring for React Native iOS app..."
echo "📱 Monitoring iOS simulator logs..."
echo "⚡ Monitoring Metro bundler logs..."
echo ""

# Function to monitor iOS logs with better filtering
monitor_ios_logs() {
    echo "📱 iOS Simulator Logs:"
    echo "======================"
    npx react-native log-ios | while IFS= read -r line; do
        if [[ "$line" =~ (ERROR|Error|error|FATAL|Exception|Failed|failed|React|JavaScript|NativeModule|ExpoImage) ]]; then
            echo "🚨 $line"
        fi
    done
}

# Function to monitor Metro logs
monitor_metro_logs() {
    echo ""
    echo "⚡ Metro Bundler Logs:"
    echo "====================="
    # Check if Metro is running
    if curl -s http://localhost:8081/status > /dev/null 2>&1; then
        echo "✅ Metro bundler is running on port 8081"
    else
        echo "❌ Metro bundler is not running"
    fi
}

# Function to check for common React Native errors
check_common_errors() {
    echo ""
    echo "🔍 Common Error Checks:"
    echo "======================"
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        echo "✅ node_modules directory exists"
    else
        echo "❌ node_modules directory missing"
    fi
    
    # Check if iOS build files exist
    if [ -d "ios/build" ]; then
        echo "✅ iOS build directory exists"
    else
        echo "❌ iOS build directory missing"
    fi
    
    # Check for common error patterns in logs
    echo ""
    echo "🔍 Recent Error Patterns:"
    echo "========================"
    if [ -f "metro.log" ]; then
        grep -E "(ERROR|Error|error|FATAL|Exception|Failed|failed)" metro.log | tail -5
    else
        echo "No metro.log file found"
    fi
}

# Run monitoring functions
monitor_ios_logs &
monitor_metro_logs &
check_common_errors

# Wait for background processes
wait 