CREATE INDEX "idx_choices_question_id" ON "choices" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "idx_question_reports_question_id" ON "question_reports" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "idx_questions_topic_id" ON "questions" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "idx_questions_topic_status" ON "questions" USING btree ("topic_id","status");--> statement-breakpoint
CREATE INDEX "idx_accounts_user_id" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_user_id" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_bookmarks_user_id" ON "bookmarks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_bookmarks_question_id" ON "bookmarks" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "idx_test_attempts_user_id" ON "test_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_test_attempts_guest_session" ON "test_attempts" USING btree ("guest_session_id");--> statement-breakpoint
CREATE INDEX "idx_test_attempts_exam_level" ON "test_attempts" USING btree ("exam_level_id");--> statement-breakpoint
CREATE INDEX "idx_user_answers_attempt_id" ON "user_answers" USING btree ("test_attempt_id");--> statement-breakpoint
CREATE INDEX "idx_user_answers_question_id" ON "user_answers" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "idx_user_progress_user_id" ON "user_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_progress_topic_id" ON "user_progress" USING btree ("topic_id");