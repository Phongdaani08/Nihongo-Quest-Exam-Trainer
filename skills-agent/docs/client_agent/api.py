from __future__ import annotations

from typing import Any

import requests

from client_agent.config import AgentConfig


class ApiError(RuntimeError):
    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.status_code = status_code

    @property
    def retryable(self) -> bool:
        return self.status_code is None or self.status_code == 429 or self.status_code >= 500


class ClientIngestApi:
    def __init__(self, config: AgentConfig, token: str | None = None):
        self.config = config
        self.token = token
        self.session = requests.Session()

    def register_installation(self) -> dict[str, Any]:
        if not self.config.registration_token:
            raise ApiError("registration token is not configured")
        return self._request(
            "POST",
            "/v1/client-installations/register",
            headers={"X-Registration-Token": self.config.registration_token},
            json={
                "client_id": self.config.client_id,
                "organization_id": self.config.organization_id,
                "project_id": self.config.project_id,
                "external_org_id": self.config.external_org_id,
                "external_project_id": self.config.external_project_id,
                "source_system": self.config.source_system,
                "schema_version": self.config.schema_version,
                "display_name": self.config.display_name,
                "billing_plan_id": self.config.billing_plan_id,
                "allowed_meters": self.config.allowed_meters,
                "metadata": self.config.metadata,
            },
            expected={201},
        )

    def send_heartbeat(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._request(
            "POST",
            "/v1/client-installations/heartbeat",
            headers=self._bearer_headers(),
            json=payload,
            expected={200},
        )

    def submit_batch(self, payload: dict[str, Any]) -> tuple[dict[str, Any], int]:
        import json
        print("FINAL BILLING PAYLOAD:", json.dumps(payload, indent=2, ensure_ascii=False))


        response = self._request(
            "POST",
            "/v1/ingest-batches",
            headers=self._bearer_headers(),
            json=payload,
            expected={202, 409},
            return_status_code=True,
        )
        return response

    def _request(
        self,
        method: str,
        path: str,
        *,
        headers: dict[str, str] | None,
        json: dict[str, Any],
        expected: set[int],
        return_status_code: bool = False,
    ) -> Any:
        url = f"{self.config.api_base_url}{path}"
        try:
            response = self.session.request(
                method=method,
                url=url,
                headers=headers,
                json=json,
                timeout=self.config.request_timeout_sec,
                verify=self.config.verify_tls,
            )
        except requests.RequestException as exc:
            raise ApiError(f"{method} {path} failed: {exc}") from exc
        payload = _read_json_or_text(response)
        if response.status_code not in expected:
            message = payload.get("error") if isinstance(payload, dict) else str(payload)
            raise ApiError(f"{method} {path} returned {response.status_code}: {message}", response.status_code)
        if return_status_code:
            return payload, response.status_code
        return payload

    def _bearer_headers(self) -> dict[str, str]:
        if not self.token:
            raise ApiError("installation bearer token is not available")
        return {"Authorization": f"Bearer {self.token}"}


def _read_json_or_text(response: requests.Response) -> Any:
    try:
        return response.json()
    except ValueError:
        text = response.text.strip()
        return {"error": text} if text else {}
