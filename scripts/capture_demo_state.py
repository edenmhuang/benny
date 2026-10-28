"""Regenerate web/src/demo-state.json from a locally running API.
Run the API with DEV_TRUST_UID_HEADER=1 (local only), then: python scripts/capture_demo_state.py http://127.0.0.1:8080"""
import json, sys, time, requests
base = sys.argv[1].rstrip('/'); h = {'X-Sender-Uid': 'demoSnapshot%d' % int(time.time())}
requests.post(base + '/v1/sample', headers=h).raise_for_status()
state = requests.get(base + '/v1/state', headers=h).json(); state['owner'] = 'demo'
out = {'capturedOn': time.strftime('%Y-%m-%d', time.gmtime()), 'note': 'Captured from the Benny API: POST /v1/sample then GET /v1/state.', 'state': state}
open('web/src/demo-state.json', 'w').write(json.dumps(out, indent=1)); print('wrote web/src/demo-state.json')
