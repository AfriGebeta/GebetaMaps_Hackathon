import 'package:flutter/material.dart';
import 'package:go_find_taxi/core/utils/index.dart';

void safeUiApiCall(
    BuildContext context, Future<void> Function() apiCall) async {
  try {
    if (context.mounted) {
      WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
        apiCall();
      });
    }
  } catch (e) {
    printError(e);
  }
}
