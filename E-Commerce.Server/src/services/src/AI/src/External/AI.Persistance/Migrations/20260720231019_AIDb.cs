using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class AIDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AIConversations",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    UserId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SessionId = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ConversationType = table.Column<int>(type: "integer", nullable: false),
                    IsArchived = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AIConversations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ErrorLogs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    StackTrace = table.Column<string>(type: "text", nullable: true),
                    Path = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Method = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    StatusCode = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ErrorLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AIMessages",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ConversationId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    InputTokenCount = table.Column<int>(type: "integer", nullable: true),
                    OutputTokenCount = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AIMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AIMessages_AIConversations_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "AIConversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AIAttachments",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    MessageId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AttachmentType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<int>(type: "integer", nullable: false),
                    FileName = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    FileUrl = table.Column<string>(type: "text", nullable: false),
                    ContentType = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AIAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AIAttachments_AIMessages_MessageId",
                        column: x => x.MessageId,
                        principalTable: "AIMessages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AIAttachments_MessageId",
                table: "AIAttachments",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_AIConversations_SessionId_ConversationType_CreatedAt",
                table: "AIConversations",
                columns: new[] { "SessionId", "ConversationType", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_AIConversations_UserId_ConversationType_CreatedAt",
                table: "AIConversations",
                columns: new[] { "UserId", "ConversationType", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_AIMessages_ConversationId_CreatedAt",
                table: "AIMessages",
                columns: new[] { "ConversationId", "CreatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AIAttachments");

            migrationBuilder.DropTable(
                name: "ErrorLogs");

            migrationBuilder.DropTable(
                name: "AIMessages");

            migrationBuilder.DropTable(
                name: "AIConversations");
        }
    }
}
