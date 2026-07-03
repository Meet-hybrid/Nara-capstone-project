import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def generate_contribution_statement(member, contributions):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("NARA Savings Circle", styles["Title"]))
    elements.append(Paragraph("Contribution Statement", styles["Heading2"]))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph(f"Member: {member.full_name}", styles["Normal"]))
    elements.append(Paragraph(f"Email: {member.email}", styles["Normal"]))
    elements.append(Spacer(1, 20))

    table_data = [["Month", "Amount (₦)", "Method", "Status", "Date"]]

    for c in contributions:
        table_data.append([
            c.month_year,
            f"{c.amount:,.2f}",
            c.get_method_display(),
            c.get_status_display(),
            str(c.deduction_date),
        ])

    table = Table(table_data, colWidths=[80, 100, 100, 80, 100])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a1a2e")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 10),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f5f5f5")]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
    ]))

    elements.append(table)
    doc.build(elements)
    buffer.seek(0)
    return buffer
