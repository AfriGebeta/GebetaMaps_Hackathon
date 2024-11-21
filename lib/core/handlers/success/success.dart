import '../result.dart';

class Success<T> {
  final T data;
  Success({required this.data});

  static Result<T> send<T>({required T data}) => result<T>(Success(data: data));

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Success<T> && other.data == data;
  }

  @override
  int get hashCode => data.hashCode;
}
