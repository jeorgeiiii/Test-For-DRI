import 'package:flutter_riverpod/flutter_riverpod.dart';

class SurveyState {
  final int currentPage;
  final int totalPages;
  final Map<String, dynamic> surveyData;
  final bool isLoading;

  const SurveyState({
    required this.currentPage,
    required this.totalPages,
    required this.surveyData,
    required this.isLoading,
  });

  SurveyState copyWith({
    int? currentPage,
    int? totalPages,
    Map<String, dynamic>? surveyData,
    bool? isLoading,
  }) {
    return SurveyState(
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
      surveyData: surveyData ?? this.surveyData,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class SurveyNotifier extends Notifier<SurveyState> {
  @override
  SurveyState build() {
    return const SurveyState(
      currentPage: 0,
      totalPages: 21, // Based on questionnaire sections
      surveyData: {},
      isLoading: false,
    );
  }

  void nextPage() {
    if (state.currentPage < state.totalPages - 1) {
      state = state.copyWith(currentPage: state.currentPage + 1);
    }
  }

  void previousPage() {
    if (state.currentPage > 0) {
      state = state.copyWith(currentPage: state.currentPage - 1);
    }
  }

  void goToPage(int page) {
    if (page >= 0 && page < state.totalPages) {
      state = state.copyWith(currentPage: page);
    }
  }

  void updateSurveyData(String key, dynamic value) {
    final newData = Map<String, dynamic>.from(state.surveyData);
    newData[key] = value;
    state = state.copyWith(surveyData: newData);
  }

  void updateSurveyDataMap(Map<String, dynamic> data) {
    final newData = Map<String, dynamic>.from(state.surveyData);
    newData.addAll(data);
    state = state.copyWith(surveyData: newData);
  }

  void setLoading(bool loading) {
    state = state.copyWith(isLoading: loading);
  }

  void reset() {
    state = const SurveyState(
      currentPage: 0,
      totalPages: 21,
      surveyData: {},
      isLoading: false,
    );
  }
}

final surveyProvider = NotifierProvider<SurveyNotifier, SurveyState>(() {
  return SurveyNotifier();
});
