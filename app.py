from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)


# Mock Data

plans = [
    {"id": 1, "name": "Fibernet Basic", "data_quota_gb": 100, "price": 500},
    {"id": 2, "name": "Fibernet Premium", "data_quota_gb": 300, "price": 1000}
]

subscriptions = []  # {"id", "user_id", "plan_id", "status", "start_date", "end_date", "auto_renew"}
discounts = []      # {"id", "plan_id", "description", "discount_percent", "active"}

plan_id_counter = len(plans) + 1
sub_id_counter = 1
discount_id_counter = 1


# Plan Management

@app.route('/admin/plans', methods=['POST'])
def create_plan():
    global plan_id_counter
    data = request.json
    plan = {
        "id": plan_id_counter,
        "name": data['name'],
        "data_quota_gb": data['data_quota_gb'],
        "price": data['price']
    }
    plans.append(plan)
    plan_id_counter += 1
    return jsonify({"message": "Plan created", "plan": plan}), 201

@app.route('/admin/plans', methods=['GET'])
def get_plans():
    return jsonify(plans), 200

@app.route('/admin/plans/<int:plan_id>', methods=['PUT'])
def update_plan(plan_id):
    data = request.json
    for p in plans:
        if p['id'] == plan_id:
            p['name'] = data.get('name', p['name'])
            p['data_quota_gb'] = data.get('data_quota_gb', p['data_quota_gb'])
            p['price'] = data.get('price', p['price'])
            return jsonify({"message": "Plan updated", "plan": p}), 200
    return jsonify({"error": "Plan not found"}), 404

@app.route('/admin/plans/<int:plan_id>', methods=['DELETE'])
def delete_plan(plan_id):
    for p in plans:
        if p['id'] == plan_id:
            plans.remove(p)
            return jsonify({"message": "Plan deleted"}), 200
    return jsonify({"error": "Plan not found"}), 404


# Discount Management

@app.route('/admin/discounts', methods=['POST'])
def create_discount():
    global discount_id_counter
    data = request.json
    discount = {
        "id": discount_id_counter,
        "plan_id": data['plan_id'],
        "description": data['description'],
        "discount_percent": data['discount_percent'],
        "active": True
    }
    discounts.append(discount)
    discount_id_counter += 1
    return jsonify({"message": "Discount created", "discount": discount}), 201

@app.route('/admin/discounts/<int:discount_id>', methods=['PUT'])
def update_discount(discount_id):
    data = request.json
    for d in discounts:
        if d['id'] == discount_id:
            d['description'] = data.get('description', d['description'])
            d['discount_percent'] = data.get('discount_percent', d['discount_percent'])
            d['active'] = data.get('active', d['active'])
            return jsonify({"message": "Discount updated", "discount": d}), 200
    return jsonify({"error": "Discount not found"}), 404


# Analytics

@app.route('/admin/analytics/top-plans', methods=['GET'])
def top_plans():
    plan_count = {}
    for s in subscriptions:
        if s['status'] == 'active':
            plan_count[s['plan_id']] = plan_count.get(s['plan_id'], 0) + 1
    top = sorted(plan_count.items(), key=lambda x: x[1], reverse=True)
    result = [{"plan_id": pid, "plan_name": next(p['name'] for p in plans if p['id']==pid), "subscriptions": count} for pid, count in top]
    return jsonify(result), 200


# AI-Based Recommendations

@app.route('/admin/recommendations/plans', methods=['GET'])
def admin_plan_recommendations():
    plan_counts = {p['id']: 0 for p in plans}
    for s in subscriptions:
        if s['status'] == 'active':
            plan_counts[s['plan_id']] += 1

    recommendations = []
    for p in plans:
        count = plan_counts[p['id']]
        if count < 2:
            recommendations.append({
                "plan_id": p['id'],
                "plan_name": p['name'],
                "suggestion": "Low subscription. Consider adding discount or promotional offer."
            })
        elif count > 5:
            recommendations.append({
                "plan_id": p['id'],
                "plan_name": p['name'],
                "suggestion": "High subscription. Consider creating a premium version or upsell."
            })
    return jsonify({"plan_recommendations": recommendations}), 200

@app.route('/admin/recommendations/discounts', methods=['GET'])
def admin_discount_recommendations():
    plan_counts = {p['id']: 0 for p in plans}
    for s in subscriptions:
        if s['status'] == 'active':
            plan_counts[s['plan_id']] += 1

    recommendations = []
    for p in plans:
        active_discount = any(d for d in discounts if d['plan_id']==p['id'] and d['active'])
        if plan_counts[p['id']] < 2 and not active_discount:
            recommendations.append({
                "plan_id": p['id'],
                "plan_name": p['name'],
                "suggestion": "Low subscription and no discount. Consider adding a promotional discount."
            })
    return jsonify({"discount_recommendations": recommendations}), 200

# Run App

if __name__ == "__main__":
    app.run(debug=True)
