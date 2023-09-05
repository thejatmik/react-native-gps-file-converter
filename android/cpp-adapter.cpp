#include <jni.h>
#include "react-native-gps-file-converter.h"

extern "C"
JNIEXPORT jdouble JNICALL
Java_com_gpsfileconverter_GpsFileConverterModule_nativeMultiply(JNIEnv *env, jclass type, jdouble a, jdouble b) {
    return gpsfileconverter::multiply(a, b);
}
