import 'package:flutter/material.dart';

class ErrorScreen extends StatelessWidget {
  final Exception? error;

  const ErrorScreen(this.error, {super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text(
          '404',
          style: TextStyle(
            fontSize: 48,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
