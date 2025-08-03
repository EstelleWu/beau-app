#!/bin/bash

echo "🤖 Starting AUTO-ERROR DETECTION for React Native..."
echo "🔍 This will automatically detect and report ALL errors"
echo ""

# Function to monitor iOS logs in real-time
monitor_ios_logs() {
    echo "📱 Monitoring iOS Simulator Logs..."
    npx react-native log-ios | while IFS= read -r line; do
        # Check for any error patterns
        if [[ "$line" =~ (ERROR|Error|error|FATAL|Exception|Failed|failed|React|JavaScript|NativeModule|ExpoImage|Uncaught|Cannot read|undefined|null) ]]; then
            echo "🚨 AUTO-DETECTED ERROR: $line"
            echo "🔧 Attempting to identify error type..."
            
            # Categorize the error
            if [[ "$line" =~ NativeModule ]]; then
                echo "💡 ERROR TYPE: Native Module Issue"
                echo "🔧 SUGGESTION: Check component imports and native dependencies"
            elif [[ "$line" =~ "Cannot read" ]]; then
                echo "💡 ERROR TYPE: Property Access Error"
                echo "🔧 SUGGESTION: Check object/array access and null checks"
            elif [[ "$line" =~ undefined ]]; then
                echo "💡 ERROR TYPE: Undefined Variable/Property"
                echo "🔧 SUGGESTION: Check variable declarations and imports"
            elif [[ "$line" =~ "Invalid JPG" ]]; then
                echo "💡 ERROR TYPE: Image Loading Error"
                echo "🔧 SUGGESTION: Convert image to PNG or check file path"
            fi
            echo "---"
        fi
    done
}

# Function to monitor Metro bundler
monitor_metro() {
    echo "⚡ Monitoring Metro Bundler..."
    # Check Metro status
    if curl -s http://localhost:8081/status > /dev/null 2>&1; then
        echo "✅ Metro is running"
    else
        echo "❌ Metro is not running - this could cause errors"
    fi
}

# Function to check for common React Native issues
check_common_issues() {
    echo "🔍 Checking for common React Native issues..."
    
    # Check if node_modules is complete
    if [ ! -d "node_modules/react-native" ]; then
        echo "❌ React Native not installed properly"
        echo "🔧 Run: npm install"
    fi
    
    # Check iOS build
    if [ ! -d "ios/build" ]; then
        echo "❌ iOS build directory missing"
        echo "🔧 Run: npx react-native run-ios"
    fi
    
    # Check for common error files
    if [ -f "metro.log" ]; then
        echo "📄 Found metro.log - checking for errors..."
        tail -10 metro.log | grep -E "(ERROR|Error|error)" || echo "No recent errors in metro.log"
    fi
}

# Function to provide real-time suggestions
provide_suggestions() {
    echo "💡 AUTO-SUGGESTIONS:"
    echo "1. If you see 'NativeModule' errors: Remove problematic components"
    echo "2. If you see 'Cannot read' errors: Add null checks"
    echo "3. If you see image errors: Convert to PNG format"
    echo "4. If app crashes: Check component imports"
    echo ""
}

# Main monitoring loop
echo "🚀 Starting comprehensive error monitoring..."
echo ""

# Run all monitoring functions
monitor_ios_logs &
monitor_metro &
check_common_issues &
provide_suggestions

# Keep the script running
wait 